
export interface Phone {
  id: string;
  brand: string;
  model: string;
  specs: string; // Storing specs as a JSON string for simplicity
  image: string;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  contact: string;
}

export interface Price {
  id:string;
  phoneId: string;
  shopId: string;
  price: number;
}
