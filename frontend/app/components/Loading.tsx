import Lottie from "lottie-react"
import moneyAnimation from "@/public/assets/moneyAnimation.json"

const Loading = () => {
  return (
    <div className=" flex w-screen h-screen bg-yellow-500">
        <Lottie animationData={moneyAnimation} loop={true} className="w-full h-full object-contain"/>
        <h1 className=" fixed right-1 bottom-1 font-mono text-green-800 text-2xl">Loading...</h1>
    </div>
  )
}

export default Loading