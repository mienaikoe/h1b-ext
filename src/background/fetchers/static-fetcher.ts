import { H1BEntity } from "../../common/types";
import Fetcher from "./fetcher";
import h1bData from "./static-h1b-data-20230220.json";


class StaticFetcher implements Fetcher {

  private h1bMap: Map<string, H1BEntity[]>;

  constructor(){
    this.h1bMap = new Map(Object.entries(h1bData));
  }

  getDataForIds = async (ids: string[]): Promise<Record<string, H1BEntity[]>> => {
    return Promise.resolve(
      ids.reduce((agg: Record<string, H1BEntity[] | null>, id: string) => {
        agg[id] = this.h1bMap.get(id);
        return agg;
      }, {})
    );
  }
}

export default StaticFetcher;