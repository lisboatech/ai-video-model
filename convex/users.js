import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
    },
    handler: async (ctx, args) => {
        // If User already Exist?
        const userData=await ctx.db.query("users")
        .filter(q=>q.eq(q.field('email'), args.email))
        .collect();

        // If Not Then Insert new user
        if(userData?.length == 0)
        {
            const data={
                name: args.name,
                email: args.email,
                picture: args.picture,
                credits: 30
            }
            const result=await ctx.db.insert("users",{
                ...data
            });

            console.log(result); // Inserted record ID

            return {
                ...data,
                _id: result
            }
           
        }

        return userData[0];
    }
})


export const updateUserCredits = mutation({
    args: {
        credits: v.number(),
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.uid, {
            credits: args.credits
        })
        return result;
    }
})
