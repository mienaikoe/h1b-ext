import type { DTSResponse, DTSRequest, DTSResponsePayload } from "./types";

export const sendRequest = async (request: DTSRequest): Promise<DTSResponsePayload> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(request, (response: DTSResponse | undefined) => {
      if( !response ){
        console.error(chrome.runtime.lastError);
        return reject("No response")
      }
      const {payload, error} = response;
      if( error ){
        return reject(error);
      } else if( typeof(payload) === 'undefined' ){
        return reject(`No payload in response: ${JSON.stringify(response)}`);
      } else {
        return resolve(payload);
      }
    });
  });
}