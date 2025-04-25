
import { createContext,useContext,useReducer } from "react"
import { CartReducer } from "../Reduser/cart-reduser"



const CartContext=createContext()



const CartProvider=({children})=>{
    const initialState={
        cart:[]
    }
    const [{cart},cartdispatch]=useReducer(CartReducer,initialState)

    return(
        <CartContext.Provider value={{cart,cartdispatch}}>
            {children}
        </CartContext.Provider>
    )
    
}

const UseCart = () => useContext(CartContext)

export {CartProvider,UseCart}