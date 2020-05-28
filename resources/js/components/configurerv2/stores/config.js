import pickBy from "lodash.pickby";

let source = axios.CancelToken.source();

export const config = {
    state: {
        config: {},
    },
    reducers: {
        update(state, payload) {
            state.config = {...state.config, ...payload};

            return state;
        },
        clear(state, payload = []) {
            state.config = pickBy(state.config, (v, k) => payload.includes(k));

            return state;
        },
        set(state, payload) {
            state.config = payload;
            return state;
        },
    },
    effects: dispatch => ({
        async computeResources(payload, root) {
            try {
                source.cancel();
                source = axios.CancelToken.source();

                dispatch.cost.setLoading(true);
                let response = await axios.get(`/api/configurer/games/a/location/b/compute-resources`, {
                    params: root.form,
                    cancelToken: source.token,
                });
                dispatch.config.update(response.data);
                await dispatch.cost.calculateCost();
                dispatch.cost.setLoading(false);
            } catch (e) {
                console.error(e);
            }
        },
    }),
};