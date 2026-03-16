import { ApiError } from "../utils/apiError.js";
const mongooseAggregateFunction = async (model, queryParameter, searchFeilds = [], filter = {}, lookup = [], project = {}, sort = { created_at: 1 }) => {
    try {
        let { page = 1, limit = 10, search } = queryParameter;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const pipLine = [];

        if (Object.keys(filter).length) {
            pipLine.push({
                $match: filter
            })
        }

        if (search && searchFeilds.length) {
            pipLine.push({
                $match: {
                    $or: searchFeilds.map((feild) => ({
                        [feild]: {
                            $regex: search,
                            $options: "i"
                        }
                    }))
                }
            })
        }

        if (lookup.length) {
            lookup.forEach((item) => {
                pipLine.push({
                    $lookup: item
                })
            })
        }

        pipLine.push({
            $sort: sort
        });

        pipLine.push({
            $facet: {
                data: [
                    {
                        $skip: skip
                    }, {
                        $limit: limit
                    }
                ],
                pagination: [
                    {
                        $count: "total"
                    }
                ]
            }
        });

        if (Object.keys(project).length) {
            pipLine.push({
                $project: project
            })
        }

        const result = await model.aggregate(pipLine);

        const data_filter = result[0]?.data || [];

        const pagination = result[0]?.pagination[0]?.total || 0;

        return {
            data: data_filter,
            pagination,
            page,
            limit,
            totalCount: Math.ceil(pagination / limit)
        }

    } catch (error) {
        console.log(error);
        throw new ApiError(400, error.message)
    }
}

export { mongooseAggregateFunction }