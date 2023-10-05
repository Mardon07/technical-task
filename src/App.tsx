import React, {useEffect, useState} from "react";
import "./App.css";
import getCommentsRequest from "./api/comments/getCommentsRequest";
import {IPagination} from "./data/comments";
import getAuthorsRequest from "./api/authors/getAuthorsRequest";
interface Author {
    id: number;
    name: string;
    avatar: string;
}
interface Data {
    id: number;
    created: string;
    text: string;
    author: number;
    parent: null | number;
    likes: number;
}

function App() {
    const [comments, setComments] = useState<IPagination<any[]>>();
    const [authors, setAuthors] = useState<Author[]>();
    const [pagination, setPagination] = useState(1);
    const allLikes = comments?.data.reduce((acc, item) => acc + item.likes, 0);
    const allAuthors = async () => {
        try {
            const response = await getAuthorsRequest();
            setAuthors(response);
        } catch (error) {
            console.log(error);
        }
    };
    const allComments = async (num: number) => {
        try {
            const response = await getCommentsRequest(num);
            setComments(response);
        } catch (error) {
            console.log(error);
        }
    };

    const getAuthor = (id: number) => {
        const child = authors?.filter((elem) => id === elem.id);

        return child![0];
    };
    const getDate = (date: string) => {
        return `${new Date(date).getHours()} час назад`;
    };
    const createClassName = (e: React.FormEvent<HTMLElement>) => {
        const eventTarget = e.target as HTMLElement;
        if (eventTarget.className === "heart") {
            eventTarget.className = "vector";
        } else {
            eventTarget.className = "heart";
        }
    };

    useEffect(() => {
        allAuthors();
        allComments(pagination);
        console.log(pagination);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination]);
    console.log(comments);
    return (
        <div
            className="App"
            style={{
                width: "100%",
                height: "100%",
                color: "white",
                fontSize: "14px",
            }}
        >
            <div
                className="container"
                style={{
                    width: "560px",
                    margin: "0 auto",
                    display: "flex",
                    paddingTop: "40px",
                    paddingBottom: "20px",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "3px solid #767676",
                        paddingBottom: "20px",
                    }}
                >
                    <div>{comments?.data.length} комментариев</div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                        }}
                    >
                        <span
                            style={{
                                cursor: "pointer",
                                width: "20px",
                                height: "20px",
                                display: "inline-block",
                            }}
                            className="heart-outline"
                        ></span>
                        {allLikes}
                    </div>
                </div>
                {comments &&
                    comments.data
                        .sort(function (a, b) {
                            return a.id - b.id;
                        })
                        .map((item: Data, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "560px",
                                    height: "auto",
                                    display: "flex",
                                    paddingLeft: `${
                                        item.parent &&
                                        (item.parent! + 1 === item.id
                                            ? "40px"
                                            : "0px")
                                    }`,
                                }}
                            >
                                <div
                                    style={{alignSelf: "flex-start"}}
                                    className="avatar"
                                >
                                    <img
                                        style={{
                                            width: "68px",
                                            height: "68px",
                                            borderRadius: "50%",
                                        }}
                                        src={getAuthor(item.author).avatar}
                                        alt="avatar"
                                    />
                                </div>
                                <div
                                    className="content"
                                    style={{
                                        width: "100%",
                                        paddingLeft: "20px",
                                        textAlign: "left",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <p>{getAuthor(item.author).name}</p>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                            }}
                                        >
                                            <span
                                                onClick={createClassName}
                                                className="heart"
                                                style={{
                                                    cursor: "pointer",
                                                    width: "18px",
                                                    height: "18px",
                                                    display: "inline-block",
                                                }}
                                            ></span>
                                            <span>{item.likes}</span>
                                        </div>
                                    </div>
                                    <div style={{marginBottom: "5px"}}>
                                        {getDate(item.created)}
                                    </div>
                                    <div>{item.text}</div>
                                </div>
                            </div>
                        ))}
                <div
                    onClick={() =>
                        setPagination(
                            pagination <= 1
                                ? pagination + 2
                                : pagination >= 3
                                ? pagination - 2
                                : pagination,
                        )
                    }
                    style={{
                        width: "234px",
                        height: "36",
                        background: "#313439",
                        fontPalette: "16px",
                        margin: "0 auto",
                        cursor: "pointer",
                    }}
                >
                    Загрузить ещё
                </div>
            </div>
        </div>
    );
}

export default App;
