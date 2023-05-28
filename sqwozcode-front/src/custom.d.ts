/* eslint-disable @typescript-eslint/ban-types */
declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const content: string;
    export default content;
}

declare namespace ymaps {
    export function ready(init: Function): Promise;

    class Promise {
        then(
            onFulfilled?: Function,
            onRejected?: Function,
            onProgress?: Function
        ): Promise;
    }

    export class Map {
        constructor(element: string, state: MapState);

        geoObjects: {
            add: (geo: GeoObject) => void;
        };
    }

    export class MapState {
        center: number[];
        zoom: number;
    }

    export class GeoObjectState {
        geometry: {
            type: string;
            coordinates: number[];
        };
        properties: {
            balloonContentHeader: string;
            balloonContentBody: string;
            balloonContentFooter: string;
        };
    }

    export class GeoObject {
        constructor(state: GeoObjectState);
    }
}
