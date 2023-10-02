import React from 'react'
import style from '../styles/vendor.module.css'
import Carousel from 'react-bootstrap/Carousel';
import {useRouter} from 'next/router'


function VendorProductItem(props:any) {
    const product=props.probs
    
    
    
    const router=useRouter()
    


  
    const handleClick=async(id:any)=>{ 
        
        
        router.push({
          pathname:'/VendorUpdateProduct',
          query:{
            productId:id
          }

        }
        )
    }

  return (
    <>



<div className="col-md-4 mt-4">
        <div className={`${style.productItem} card text-center p-3 shadow-sm`} >
        <p className={style.product_title}>{product.shoeName}</p>
      : <p className={style.price}>{product.retailPrice}</p>

        <Carousel>
            
                
                    <Carousel.Item  key={product._id}>
                    <img
                      className="d-block w-100"
                      src={product.thumbnail}
                      style={{width:'100%',height:'15rem',maxHeight:'15rem',objectFit:'contain'}}
                      alt="First slide"
                    />
                  
                  </Carousel.Item>

            
    </Carousel>


    
       <div className='d-flex justify-content-between align-item-center'>
       <p >In stock : {product.stock}</p>
       
       <button className={`btn ${style.edit_btn} `} onClick={()=>handleClick(product._id)}>Edit</button>
       </div>
        </div>
    </div>
    
    
    </>
  )
}

export default VendorProductItem