import type { H1BEntity } from "../../common/types";

interface Fetcher {
  getDataForIds: (ids: string[]) => Promise<Record<string, H1BEntity[]>>
  getDataForSlug: (slug: string) => Promise<H1BEntity[]>
};

export default Fetcher;