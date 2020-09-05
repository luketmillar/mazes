import Grid from "./Grid"
import Mask from "./Mask"

export default class MaskedGrid extends Grid {
    private readonly mask: Mask
    constructor(mask: Mask) {
        super(mask.rows, mask.columns)
        this.mask = mask
    }
}