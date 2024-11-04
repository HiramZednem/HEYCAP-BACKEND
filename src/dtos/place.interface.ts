
export interface DataGoogle {
    html_attributions: any[];
    next_page_token:   string;
    results:           Place[];
}

export interface Place {
    geometry:              Geometry;
    icon:                  string;
    icon_background_color: string;
    icon_mask_base_uri:    string;
    name:                  string;
    photos:                Photo[];
    place_id:              string;
    reference:             string;
    scope:                 string;
    types:                 string[];
    vicinity:              string;
    rating?:               number;
    price_level:           number;
}

export interface Geometry {
    location: Location;
    viewport: Viewport;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: Location;
    southwest: Location;
}

export interface Photo {
    height:            number;
    html_attributions: string[];
    photo_reference:   string;
    width:             number;
}

export interface PlaceResponse {
    google_id: string;
    name: string;
    photos: string[];
    rating: number;
    vicinity: string;
    lat: number;
    lng: number;
    types: string[];
}