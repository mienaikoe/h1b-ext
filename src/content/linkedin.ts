import { CSAction, CSRequestGetH1BData, CSResponseGetH1BData, H1BEntity } from "../common/types";
import { waitForTheElement } from 'wait-for-the-element';

enum LinkedInSelectors {
  List = ".jobs-search-results-list ul",
  CompanyLink = "a.job-card-container__company-name",
}

const getList = async (): Promise<Element> => {
  const list = await waitForTheElement(LinkedInSelectors.List, {
    timeout: 10000
  });

  if( !list ){
    throw new Error("No List");
  }

  return list;
}

const getCompanyId = (companyLink: HTMLAnchorElement): string | null => {
  const href = companyLink.href;
  if( !href ){
    return null;
  }

  const url = new URL(href);
  const urlPieces = url.pathname.split("/");
  // '', 'company', <number>, ''
  return urlPieces[2];
}

const constructH1BTag = (entities: H1BEntity[]) => {
  const tag = document.createElement("span");
  tag.style.display = "inline-block";
  tag.style.backgroundColor = "cyan";
  tag.style.color = "white";
  tag.style.padding = "6px 12px";
  tag.style.borderRadius = "3px";

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


const applyH1BTags = async () => {
  try{
    const list = await getList();

    const companyItems = list.querySelectorAll(LinkedInSelectors.CompanyLink);
    const companyIdItems: Record<string, Element> = {};
    companyItems.forEach(child => {
      const companyId = getCompanyId(child as HTMLAnchorElement);
      if( !companyId ){
        console.warn("No Company Id for:", child);
        return;
      }
      companyIdItems[companyId] = child;
    });

    const h1bData = await getH1BData(
      Object.keys(companyIdItems)
    );
    if( !h1bData ){
      console.error("")
    }

    Object.entries(companyIdItems).forEach(([companyId, child]) => {
      const h1bEntities = h1bData[companyId];
      if( !h1bEntities ){
        console.log("No h1bData for:", companyId);
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
