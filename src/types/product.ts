export type TManufacturer = {
    name: string;
    address: string;
    contact: string;
  };
  
  export type TProduct = {
    _id?:string,
    name:string,
    product:{

        name: string;
        image: string;
    }
    image:string,
    totalPrice:number;
    description: string;
    price: number;
    inStock: boolean;
    quantity: number;
    requiredPrescription: boolean;
    expiryDate: string; 
    manufacturer: TManufacturer;
    updated_at: string; 
  };
  