import {loadStripe} from '@stripe/stripe-js'
let stripePromise=null

const getStripe=()=>{


    if(!stripePromise){
        stripePromise=loadStripe("pk_test_51Mj0VEILkb1ueBAx06do7xnNP542h6Nd9vbA5CVHnsZiIdeQiBxM5uysAiekcORP5CmMSbl6kRaniGlBpaVHasrA00HkC2adWV")
    }
    return stripePromise
}
export default getStripe  