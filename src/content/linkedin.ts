import { CSAction, CSRequestGetH1BData, CSResponseGetH1BData, H1BEntity } from "../common/types";
import { waitForTheElement } from 'wait-for-the-element';

const H1B_TAG = "h1buddy-tag";

enum LinkedInSelectors {
  List = ".jobs-search-results-list ul",
  CompanyLink = "a.job-card-container__company-name",
}

let listElement: Element | undefined = undefined;

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
  return urlPieces[2];
}

const constructH1BTag = (entities: H1BEntity[]) => {
  const tag = document.createElement("span");
  tag.style.display = "inline-block";
  tag.style.backgroundColor = "cyan";
  tag.style.color = "black";
  tag.style.fontWeight = "bold";
  tag.style.padding = "4px 8px";
  tag.style.borderRadius = "3px";

  tag.className = H1B_TAG;
  tag.innerHTML = "H1B";

  return tag;
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
  const observer = new MutationObserver((mutationList, observer) => {
    console.log("Mutation in List");
    callback();
  });
  observer.observe(targetNode, { childList: true });
}


const h1bData: Map<string, H1BEntity[]> = new Map();

const refreshH1BData = async (companyIds: string[]) => {
  const neededCompanyIds = companyIds.filter(companyId => !(companyId in h1bData));
  if( neededCompanyIds ){
    const newH1BData = await getH1BData(
      companyIds
    );
    if( !newH1BData ){
      console.error("")
    }
    Object.entries(newH1BData).forEach(([linkedInId, entry]) => {
      h1bData.set(linkedInId, entry);
    });
  }
}


const applyH1BTags = async () => {
  try{
    if( !listElement ){
      await refreshListElement();
      subscribeToMutations(listElement, applyH1BTags);
    }

    const companyItems = listElement.querySelectorAll(LinkedInSelectors.CompanyLink);
    const companyIdItems: Record<string, Element> = {};
    companyItems.forEach(child => {
      const companyId = getCompanyId(child as HTMLAnchorElement);
      if( !companyId ){
        console.warn("No Company Id for:", child);
        return;
      }
      companyIdItems[companyId] = child;
    });

    const companyIds = Object.keys(companyIdItems);
    await refreshH1BData(companyIds);

    Object.entries(companyIdItems).forEach(([companyId, child]) => {
      const h1bEntities = h1bData.get(companyId);
      if( !h1bEntities ){
        console.log("No h1bData for:", companyId);
        return;
      }

      const h1bTag = child.nextElementSibling;
      if( h1bTag && h1bTag.className === H1B_TAG ){
        return;
      }

      const h1bElement = constructH1BTag(h1bEntities);
      child.parentElement?.appendChild(h1bElement);
    })
  } catch(err) {
    console.error(err);
  }
}

applyH1BTags();
