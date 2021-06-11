export default {
    allThaiPostcodes(state) {
        let list = [];
        for (let province in state.thailand) {
            list = [...list, ...state.thailand[province]];
        }
        return list;
    }
};