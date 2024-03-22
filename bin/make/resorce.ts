import { makeController, makeDTO, makekModel, makeService, makeValidation } from "../fnc"


(async () => {
    await makekModel({ withDTO: true });
    await makeDTO({ withModel: true });
    await makeValidation();
    await makeController({ withService: true, withValidation: true });
    await makeService({ withService: true, withValidation: true, withDTO: true, withModel: true });
})()