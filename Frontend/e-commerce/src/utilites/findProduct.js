

export const findProduct=(cart,id)=>{
    return cart?.length>0&&cart.some(product=>product.id===id)

}