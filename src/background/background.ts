import { CSAction } from "../common/types";
import type { CSRequest, CSResponseGetH1BData } from "../common/types";
import AirtableFetcher from "./fetchers/airtable-fetcher";
import StaticFetcher from "./fetchers/static-fetcher";

const handlers = {
  [CSAction.getH1BData]: async (
    request: CSRequest,
    sendResponse: (response: CSResponseGetH1BData) => void
  ) => {
    // const fetcher = new AirtableFetcher();
    const fetcher = new StaticFetcher();
    const h1bData = await fetcher.getDataForIds(request.payload.ids);
    sendResponse({
      payload: h1bData
    });
  }
}

const onMessage = (
  request: CSRequest,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => {
  if (!request.action) {
    sendResponse({ status: "unused" });
    return;
  }

  const handler = handlers[request.action];
  if( !handler ){
    console.log("Invalid Request:", request);
    return false;
  }

  console.log("Handling Request: ", request.action);

  handler(request, sendResponse);

  return true;
}

chrome.runtime.onMessage.addListener(onMessage);
