import asyncHandler from "../utils/asyncHandler.js";
import {connection} from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const addDesignation = asyncHandler(async (req, res) => {
    const desingation = req.body;
    const insertQuery  = `INSERT INTO designation ${desingation}`;

    connection.query(insertQuery, [desingation], (err, result, fields) => {
        if (err) {
            res.status(400).json(new ApiError(400, "Error while adding designation", ['Error while adding designation']));
        }

        res.status(201).json(new ApiResponse(201, result, "Designation Added."));
    });
})