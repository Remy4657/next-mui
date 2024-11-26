import connectDB from "@/app/config/mongoose"
import { NextRequest, NextResponse } from "next/server";
import Post from "@/app/config/models/Post";

// get detail
export async function GET(req: NextRequest, context: { params: { postId: string } }) {
    //await connectDB()

    try {
        const idPost = context.params.postId
        const detailPost = await Post.findById(idPost)
        if (detailPost) {
            return NextResponse.json({
                data: detailPost,
                message: "Get detail post success"
            }, { status: 201, statusText: "Get success" })
        }
        return NextResponse.json({
            data: null,
            message: "The post is not exist"
        }, { status: 400, statusText: "Get failed" })

    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({
            data: null,
            message: "Error"
        }, { status: 400, statusText: "Created error" })
    }
}

// update 
export async function PUT(req: NextRequest, context: { params: { postId: string } }) { // 
    //await connectDB()
    try {

        const { title, description } = await req.json()

        const idPost = context.params.postId    // get postId on URL
        const post = await Post.findById(idPost)
        if (!post) {
            return NextResponse.json({
                data: null,
                message: "The post is not exist"
            }, { status: 400, statusText: "Failed" })
        }
        const existedTitle = await Post.findOne({ title, _id: { $ne: idPost } })
        if (existedTitle) {
            return NextResponse.json({
                data: null,
                message: "Title duplicate"
            }, { status: 201, statusText: "Get success" })
        }
        const updated = await Post.findByIdAndUpdate(idPost, { title, description }, { new: true })
        return NextResponse.json({
            data: updated,
            message: "Update post success"
        }, { status: 400, statusText: "Failed" })

    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({
            data: null,
            message: "Error"
        }, { status: 400, statusText: "Created error" })
    }
}
// delete 
export async function DELETE(req: NextRequest, context: { params: { postId: string } }) { // 
    //await connectDB()
    try {

        const idPost = context.params.postId    // get postId on URL
        const post = await Post.findById(idPost)
        if (!post) {
            return NextResponse.json({
                data: null,
                message: "The post is not exist"
            }, { status: 400, statusText: "Failed" })
        }

        const postDelete = await Post.findByIdAndDelete(idPost)
        return NextResponse.json({
            data: postDelete,
            message: "Delete post success"
        }, { status: 200, statusText: "Success" })
    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({
            data: null,
            message: "Error"
        }, { status: 500, statusText: "Created error" })
    }
}
