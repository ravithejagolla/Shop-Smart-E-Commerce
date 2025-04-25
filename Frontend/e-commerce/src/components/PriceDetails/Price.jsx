import { UseCart } from "../../context/cart-context"
import { TotalAmmount } from "../../utilites/totalProductPrice"

export const PriceDetails = () => {
    const {cart} = UseCart()
    const totalProducrPrice = TotalAmmount(cart)
    const DeliveryCharges=49

    
    return (
        <div >
           
            <div className=" w-[300px] flex flex-col gap-5  mt-20 shadow-2xs">
            <h3>Price Details</h3>
                <div className="flex">
                    <p >Price {cart.length} items</p>
                    <p className="ml-auto">Rs. {totalProducrPrice}</p>
                </div>
                <div className="flex">
                    <p>DeliveryCharges</p>
                    <p className="ml-auto">Rs.{DeliveryCharges}</p>
                </div>
                <div className="flex">
                    <p className="flex ">Total Ammount: </p>
                    <p className="ml-auto"> Rs.{totalProducrPrice+DeliveryCharges}</p>
                </div>
                <div>
                <button
                        className="flex-1 bg-green-700 text-white text-center w-full  py-2 px-4 rounded-md hover:bg-green-700 transitionflex items-center justify-center"
                       
                    > Place Order</button>
                </div>
            </div>

        </div >
    )
}