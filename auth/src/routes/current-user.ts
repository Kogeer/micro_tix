import express from "express";

import {currentUser} from "@kogeertix/common";

const router = express.Router();

router.get(
    '/api/users/currentuser',
    currentUser,
    (req, res) => {
        // req.currentUser come from currentUser middleware
        res.send({currentUser: req.currentUser || null});
    }
);

export {router as currentUserRouter};
