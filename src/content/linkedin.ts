import { CSAction } from "../common/types";
import type { CSRequestGetH1BData, CSResponseGetH1BData, H1BEntity } from "../common/types";
import { waitForTheElement } from 'wait-for-the-element';
import H1BIndicator from './linkedin/H1BIndicator.svelte';

const DTS_TAG = "dts-tag";

enum LinkedInSelectors {
  List = ".jobs-search-results-list ul.scaffold-layout__list-container",
  CompanyLink = "a.job-card-container__company-name",
  CompanyImage = ".artdeco-entity-lockup__image",
}

let listElement: Element | undefined = undefined;

const searchedCompanyIds: Set<string> = new Set();
const h1bData: Map<string, H1BEntity[]> = new Map();


const refreshListElement = async () => {
  const list = await waitForTheElement(LinkedInSelectors.List, {
    timeout: 10000
  });

  if( !list ){
    throw new Error("No List");
  }

  listElement = list;
}

const getCompanyId = (companyLink: HTMLAnchorElement): string | null => {
  const href = companyLink.href;
  if( !href ){
    return null;
  }

  const url = new URL(href);
  const urlPieces = url.pathname.split("/");
  const companyId = urlPieces[2];

  return companyId || null;
}

const constructH1BTag = (element: Element, entities: H1BEntity[]) => {
  new H1BIndicator({
    target: element,
    props: {
      entities,
    }
  });
}

const getH1BData = async (linkedInCompanyIds: string[]): Promise<Record<string, H1BEntity[]>> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: CSAction.getH1BData,
      payload: {
        ids: linkedInCompanyIds
      },
    } as CSRequestGetH1BData, (response: CSResponseGetH1BData | undefined) => {
      if( !response ){
        console.error(chrome.runtime.lastError);
        return reject("No Response")
      }
      const {payload, error} = response;
      if( error ){
        return reject(error);
      } else if( !payload ){
        return reject("No Payload");
      }else {
        return resolve(payload);
      }
    });
  });

}

const subscribeToMutations = (targetNode: Element, callback: () => {}) => {
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, { childList: true, subtree: true });
}

const refreshH1BData = async (companyIds: string[]) => {
  if( !companyIds.length ){
    return;
  }

  const newH1BData = await getH1BData(
    companyIds
  );
  if( !newH1BData ){
    return;
  }
  Object.entries(newH1BData).forEach(([linkedInId, entry]) => {
    h1bData.set(linkedInId, entry);
  });
}


const applyH1BTags = async () => {
  try{
    const companyItems = listElement.querySelectorAll(LinkedInSelectors.CompanyLink);
    const companyIdItems: Record<string, Element> = {};
    companyItems.forEach(companyItem => {
      const companyId = getCompanyId(companyItem as HTMLAnchorElement);
      if( companyId ){
        companyIdItems[companyId] = companyItem;
      }
    });

    const companyIds = Object.keys(companyIdItems).
      filter(companyId => !searchedCompanyIds.has(companyId));

    await refreshH1BData(companyIds);

    Object.entries(companyIdItems).forEach(([companyId, child]) => {
      const h1bEntities = h1bData.get(companyId);
      if( !h1bEntities ){
        return;
      }

      const container = child.parentElement.parentElement.parentElement;
      const imageContainer = container.querySelector(LinkedInSelectors.CompanyImage);
      if( !imageContainer || imageContainer.children.length !== 1 ){
        return;
      }

      constructH1BTag(imageContainer, h1bEntities);
    })
  } catch(err) {
    console.error(err);
  }
}

const initialize = async () => {
  await refreshListElement();
  await applyH1BTags();
  subscribeToMutations(listElement, applyH1BTags);
}

initialize();

