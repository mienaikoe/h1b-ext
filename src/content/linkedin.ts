import { DTSAction, type DTSRequest, type DTSRequestGetH1BDataBySlug, type DTSResponse, type DTSResponseGetH1BDataById, type DTSResponseGetH1BDataBySlug, type DTSResponsePayloadGetH1BDataById, type DTSResponsePayloadGetH1BDataBySlug } from "../common/types";
import type { DTSRequestGetH1BDataById, H1BEntity } from "../common/types";
import { waitForTheElement } from 'wait-for-the-element';
import { sendRequest } from "../common/chromeMessaging";
import H1BIndicator from './linkedin/H1BIndicator.svelte';
import H1BSummary from "./linkedin/H1BSummary.svelte";

enum LinkedInSelectors {
  JobsList = ".jobs-search-results-list ul.scaffold-layout__list-container",
  JobDetails = ".jobs-search__job-details",

  CompanyLink = "a.job-card-container__company-name",
  CompanyImage = ".artdeco-entity-lockup__image",

  JobsTopCard = ".jobs-unified-top-card",
  JobsTopCardUrl = ".jobs-unified-top-card__company-name a",

  H1BIndicatorTag = ".h1bContainer",
  H1BSummaryTag = ".h1bSummary",

  SPADiv = ".authentication-outlet",
}

let listElement: Element | undefined = undefined;
let detailsElement: Element | undefined = undefined;

const searchedCompanyIds: Set<string> = new Set();
const indicatedCompanyIds: Set<string> = new Set();
let searchedCompanySlug: string | null = null;
const companyIdEntities: Map<string, H1BEntity[]> = new Map();
const companySlugEntities: Map<string, H1BEntity[]> = new Map();


const refreshElement  = async (selector: string): Promise<Element> => {
  const el = await waitForTheElement(selector, {
    timeout: 10000
  });

  if( !el ){
    console.warn("Element Not Found: "+selector);
  }

  return el;
}

const getCompanyIdOrSlug = (companyLink: HTMLAnchorElement): string | null => {
  const href = companyLink.href;
  if( !href ){
    return null;
  }

  const url = new URL(href);
  const urlPieces = url.pathname.split("/");
  const companyId = urlPieces[2];

  return companyId || null;
}


const constructH1BIndicator = (element: Element, entities: H1BEntity[]) => {
  new H1BIndicator({
    target: element,
    props: {
      entities,
    }
  });
}



const getH1BDataById = async (linkedInCompanyIds: string[]): Promise<DTSResponsePayloadGetH1BDataById> => {
  const request = {
    action: DTSAction.getH1BDataById,
    payload: {
      ids: linkedInCompanyIds
    },
  } as DTSRequestGetH1BDataById;
  return await sendRequest(request) as DTSResponsePayloadGetH1BDataById;
}

const getH1BDataBySlug = async (slug: string): Promise<DTSResponsePayloadGetH1BDataBySlug> => {
  const request = {
    action: DTSAction.getH1BDataBySlug,
    payload: {
      slug,
    },
  } as DTSRequestGetH1BDataBySlug;
  return await sendRequest(request) as DTSResponsePayloadGetH1BDataBySlug;
}

const subscribeToMutations = (targetNode: Element, callback: () => void, subtree=true) => {
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, { childList: true, subtree });
  return observer;
}

const refreshCompanyIdEntities = async (companyIds: string[]) => {
  if( !companyIds.length ){
    return;
  }

  const newH1BData = await getH1BDataById(
    companyIds
  );
  if( !newH1BData ){
    return;
  }

  Object.entries(newH1BData).forEach(([linkedInId, entry]) => {
    companyIdEntities.set(linkedInId, entry);
  });
}

const refreshCompanySlugEntities = async (slug: string) => {
  if( !slug || slug == 'search' ){
    return;
  }

  if( companySlugEntities.has(slug) ){
    return;
  }

  const newH1BData = await getH1BDataBySlug(slug);
  if( !newH1BData ){
    return;
  }

  companySlugEntities.set(slug, newH1BData);
}


const applyH1BIndicators = async () => {
  try{
    const companyItems = listElement.querySelectorAll(LinkedInSelectors.CompanyLink);
    const companyIdItems: Record<string, Element> = {};
    companyItems.forEach(companyItem => {
      const companyId = getCompanyIdOrSlug(companyItem as HTMLAnchorElement);
      if( companyId ){
        companyIdItems[companyId] = companyItem;
      }
    });

    const companyIds = Object.keys(companyIdItems)
    .filter(
      companyId => !searchedCompanyIds.has(companyId)
    );
    if( companyIds.length ){
      companyIds.forEach(companyId => searchedCompanyIds.add(companyId));
      await refreshCompanyIdEntities(companyIds);
    }

    Object.entries(companyIdItems).forEach(([companyId, child]) => {
      const h1bEntities = companyIdEntities.get(companyId);
      if( !h1bEntities ){
        return;
      }

      const container = child.parentElement.parentElement.parentElement;
      const imageContainer = container.querySelector(LinkedInSelectors.CompanyImage);
      if( !imageContainer ){
        return;
      }
      if( imageContainer.children.length > 1 ){
        return;
      }

      constructH1BIndicator(imageContainer, h1bEntities);
    })
  } catch(err) {
    console.error(err);
  }
}

const constructH1BSummary = (element: Element, entities: H1BEntity[]) => {
  new H1BSummary({
    target: element,
    props: {
      entities,
    }
  });
}

const applyH1BSummary = async () => {
  try {
    const companyLink = await refreshElement(LinkedInSelectors.JobsTopCardUrl);
    if( !companyLink ){
      console.error("No Company Link Found");
      return;
    }

    const companySlug = getCompanyIdOrSlug(companyLink as HTMLAnchorElement);
    if( !companySlug ){
      console.error("No Company Slug found");
      return;
    }
    if( searchedCompanySlug ){
      if( searchedCompanySlug === companySlug  ){
        return;
      } else {
        const existingSummary = detailsElement.querySelector(LinkedInSelectors.H1BSummaryTag);
        if( existingSummary ){
          existingSummary.remove();
        }
      }
    }

    searchedCompanySlug = companySlug;
    await refreshCompanySlugEntities(companySlug);

    const entities = companySlugEntities.get(companySlug);
    if( !entities ){
      console.log("Company Not Found");
      return;
    }

    const topCardElement = await refreshElement(LinkedInSelectors.JobsTopCard);
    if (!topCardElement){
      return;
    }

    const existingSummary = topCardElement.querySelector(LinkedInSelectors.H1BSummaryTag);
    if( existingSummary ){
      return;
    }

    constructH1BSummary(topCardElement, entities);
  } catch(err) {
    console.warn(err);
  }
}

const refresh = async () => {
  listElement = await refreshElement(LinkedInSelectors.JobsList);
  await applyH1BIndicators();

  detailsElement = await refreshElement(LinkedInSelectors.JobDetails);
  await applyH1BSummary();

  const listObserver = subscribeToMutations(listElement, applyH1BIndicators);
  const detailsObserver = subscribeToMutations(detailsElement, applyH1BSummary);

  return () => {
    listObserver.disconnect();
    detailsObserver.disconnect();
  }
}

const initialize = async () => {
  let disconnect = await refresh();

  const rootElement = await refreshElement(LinkedInSelectors.SPADiv);

  subscribeToMutations(rootElement, async () => {
    if( window.location.href.includes("/jobs/search") ){
      disconnect();
      disconnect = await refresh();
    }
  }, false);
}

initialize();