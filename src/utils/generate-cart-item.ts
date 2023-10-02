import isEmpty from "lodash/isEmpty";

export function generateCartItem(item: any, attributes: object) {
  const { _id, shoeName, thumbnail, retailPrice,stock } = item;
  return {
    id: !isEmpty(attributes)
      ? `${_id}.${Object.values(attributes).join(".")}`
      : _id,
      name:shoeName,
    
    image: thumbnail,
    price: retailPrice,
    stock,
    attributes,
  };
}
