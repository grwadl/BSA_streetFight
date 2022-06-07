import { callApi } from '../helpers/apiHelper';

class FighterService {
  #endpoint = 'fighters.json';

  async getFighters() {
    try {
      const apiResult = await callApi(this.#endpoint);
      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    try{
      return await callApi(`details/fighter/${id}.json`);
    }
    catch(e){
      throw new Error('Failed to fetch data')
    }
  }
}

export const fighterService = new FighterService();
