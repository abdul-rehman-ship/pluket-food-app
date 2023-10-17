import isEmpty from "lodash/isEmpty";

export function generateCartItem(item: any, attributes: object) {
  const { id, name,image, description,price,variations,selectedVariations ,initialStock ,size} = item;
  return {
    id: !isEmpty(attributes)
      ? `${id}.${Object.values(attributes).join(".")}`
      : id,
      name:name,
    
    image: image,
    price ,
    stock:initialStock,
    variations,
    description,
    selectedVariations,
    size

  };
}
