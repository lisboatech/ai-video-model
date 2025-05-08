"use client"
import { useContext } from "react";
import {Button} from "../../../components/ui/button";
import {UserDetailContext} from "../../../context/UserDetailContext";
import {api} from "../../../convex/_generated/api";
import {useMutation} from "convex/react";


export const creditsPlans = [
    {
        credits: 80,
        cost: 5
    },
    {
        credits: 200,
        cost: 10,
    },
    {
        credits: 450,
        cost: 20,
    },
    {
        credits: 1000,
        cost: 30,
    }

]


function Billing() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const updateUserCredits = useMutation(api.users.updateUserCredits);



    return (
        <div>
            <h2 className="font-bold text-3xl">Credits</h2>

            <div className="p-4 border rounded-xl flex justify-between">
                <div>
                    <h2 className="font-bold text-xl">Total Credits</h2>
                    <h2 className="text-sm">10 Credits = 1 Video</h2>
                </div>
                <h2 className="font-bold text-3xl">{userDetail?.credits}</h2>
            </div>

            <p className="text-sm p-5 text-gray-500 max-w-2xl">
                W
            </p>

            <div className="mt-5">
                <h2></h2>
            </div>

        </div>
    )

}

export default Billing;
