export interface Product {
    id: number;
    title: string;
    article: string;
    brand_id: string;
    brand: string;
    category_type_id: number;
    category: string;
    category_code: string;
    description: string;
    hit: "1" | "0";
    image: string;
    slider_images: string;
    price: number;
    price_old: number;
    unit: string;
    stock: number;
    variations: ProductVariation[];
}

export interface ProductVariation {
    id: number;
    image: string;
}