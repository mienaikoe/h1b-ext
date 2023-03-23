import { DTSAction, type DTSRequestGetH1BDataById, type DTSRequestGetH1BDataBySlug, type DTSResponseGetH1BDataById, type DTSResponseGetH1BDataBySlug } from "../common/types";
import type { DTSRequest } from "../common/types";
import AirtableFetcher from "./fetchers/airtable-fetcher";
import StaticFetcher from "./fetchers/static-fetcher";

const handlers = {
  [DTSAction.getH1BDataById]: async (
    request: DTSRequest,
    sendResponse: (response: DTSResponseGetH1BDataById) => void
  ) => {
    // const fetcher = new AirtableFetcher();
    const fetcher = new StaticFetcher();
    const typedRequest = request as DTSRequestGetH1BDataById;
    const entities = await fetcher.getDataForIds(typedRequest.payload.ids);
    sendResponse({
      payload: entities
    });
  },
  [DTSAction.getH1BDataBySlug]: async (
    request: DTSRequest,
    sendResponse: (response: DTSResponseGetH1BDataBySlug) => void
  ) => {
    // const fetcher = new AirtableFetcher();
    const fetcher = new StaticFetcher();
    const typedRequest = request as DTSRequestGetH1BDataBySlug;
    const entities = await fetcher.getDataForSlug(typedRequest.payload.slug);
    sendResponse({
      payload: entities,
    });
  }
}

const onMessage = (
  request: DTSRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => {
  if (!request.action) {
    sendResponse({
      error: new Error("You must supply an action in your request")
    });
    return false;
  }

  const handler = handlers[request.action];
  if( !handler ){
    console.error("Invalid Request:", request);
    sendResponse({
      error: new Error(`Unsupported Action: ${request.action}`)
    });
    return false;
  }

  console.log("Handling Request: ", request.action);

  try{
    handler(request, sendResponse);
  } catch(error) {
    console.error(error);
    sendResponse({
      error,
    })
  }

  return true;
}

chrome.runtime.onMessage.addListener(onMessage);
