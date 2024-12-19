import React, { useState } from "react";
import { Box, Grid, Checkbox, Card, CardHeader, Avatar, Typography, Button, IconButton } from "@mui/material";
import { MoreVert, VerifiedUserOutlined } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardField from "./CardField";
import TMenu from "../TMenu";
import { useNavigate } from "react-router-dom";

export default function CardUserItem({
    item,
    columns,
    selectedBox,
    setSelectedBox,
    uniqueId,
    actions,
    icon,
    page,
}) {
    const [isActive, setIsActive] = useState(false);
    const nav = useNavigate();
    const avatar = item?.avatar || "";

    const handleCheckboxChange = (event) => {
        if (event.target.checked) {
            return setSelectedBox(uniqueId);
        } else {
            setSelectedBox('')
        }
    };
    // Remove id and action columns
    columns = columns.filter(
        (column) => column.field !== "id" && column.field !== "action"
    );

    return (
                <Card
                    
                    sx={{
                        borderWidth: 1,
                        borderColor: "border.main",
                        borderRadius: "20px",
                        padding: "0px",
                        width:"20rem",
                        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'
                    }}

                >
                    <CardHeader
                        action={
                            <IconButton onClick={()=>nav(`edit/${uniqueId}`)} color="primary" sx={{ margin: "8px 10px 0 0" }}>
                                <EditIcon sx={{ fontSize: "17px" }} />
                            </IconButton>
                        }
                        avatar={
                            <IconButton color="primary" sx={{ margin: "3px 0px 0 0" }}>
                                <DeleteIcon sx={{ fontSize: "17px" }} />
                            </IconButton>
                        }
                        sx={{ padding: "0px" }}
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ padding: "70%" }}>{avatar}</Avatar>
                        </Box>
                        <div
                            style={{
                                width: "70%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                            }}
                        >
                            <div>
                                <Typography variant="h6" component="div">
                                    "hjk"
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    "mjk"
                                </Typography>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 2,
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-flex",
                                        fontSize: "12px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "20px",
                                        padding: "5px 9px",
                                        backgroundColor: "green",
                                        color: "#fff",
                                        cursor: "pointer",
                                        textAlign: "center",
                                    }}
                                    onClick={() => setIsActive(!isActive)}
                                >
                                    Active
                                </div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ borderRadius: "20px", textTransform: "unset" }}
                                >
                                    Reset Pass
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
    );
}

const styles = {
    root_item: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "98%",
        padding: "10px",
        backgroundColor: "white.lightDark",
        boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        margin: "auto",
        marginBottom: "16px",
        borderRadius: "10px",
    },
    card_left_box: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        padding: "10px",
        height: "100%",
    },
    card_right_box: {
        width: "calc(100% - 150px)",
        height: "100%",
        paddingBottom: "10px",
    },
    icon: {
        backgroundColor: "primary.light",
        borderRadius: "10px",
        padding: "10px",
    },
};
