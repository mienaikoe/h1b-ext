import type { H1BEntity } from "../../common/types";
import type Fetcher from "./fetcher";
import h1bData from "./static-h1b-data-20230220.json";


class StaticFetcher implements Fetcher {

  private h1bIdMap: Map<string, H1BEntity[]>;
  private h1bSlugMap: Map<string, H1BEntity[]>;

  constructor(){
    this.h1bIdMap = new Map(Object.entries(h1bData));
    this.h1bSlugMap = new Map();
    Object.values(h1bData).forEach((rawEntities) => {
      (rawEntities as H1BEntity[]).forEach(h1bEntity => {
        const slug = h1bEntity.linkedin.slug
        if( !slug ){
          return;
        }
        if( this.h1bSlugMap.has(slug) ){
          const existingEntities = this.h1bSlugMap.get(slug);
          existingEntities.push(h1bEntity);
        } else {
          this.h1bSlugMap.set(slug, [h1bEntity]);
        }
      });
    })
  }

  getDataForIds = async (ids: string[]): Promise<Record<string, H1BEntity[]>> => {
    return Promise.resolve(
      ids.reduce((agg: Record<string, H1BEntity[] | null>, id: string) => {
        agg[id] = this.h1bIdMap.get(id);
        return agg;
      }, {})
    );
  }

  getDataForSlug = async (slug: string): Promise<H1BEntity[]> => {
    return Promise.resolve(this.h1bSlugMap.get(slug));
  }
}

export default StaticFetcher;