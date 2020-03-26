

class Controller {
    
    
    constructor () {
        this._nonSchematicFields = [
            'select',
            'sort',
            'limit',
            'page'
        ];
    }


    parseQueryOperators = (parameters) => {
        let stringedParams = JSON.stringify(this._removeNonSchemaFieldsFrom(parameters));
        stringedParams = stringedParams.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        return JSON.parse(stringedParams);
    }

    _removeNonSchemaFieldsFrom = (parameters) => {
        const fields = this._nonSchematicFields.forEach(field => delete parameters[field]);
        return parameters;
    }

    orderBy = (orderBy) => {
        if (!orderBy) {
            return '-createAt';
        }
        return orderBy.split(',').join(' ');
    }

    selectFields = (fields) => {
        if (!fields) {
            return false;
        }

        return fields.split(',').join(' ');
    }

    pagination = (page, limit, totalDocuments) => {
        const pg = parseInt(page, 10) || 1;
        const lmt = parseInt(limit, 10) || 1;
        const startIndex = (pg - 1) * lmt;
        const endIndex = pg * lmt;
        /**
         * Pagination Results
         */
        const pagination = {};
        if (endIndex < totalDocuments) {
            pagination.next = {
                page: pg + 1,
                limit:lmt
            }
        }

        if (startIndex > 0 ) {
            pagination.prev = {
                page: pg - 1,
                limit:lmt
            }
        }

        pagination.startIndex = startIndex;
        pagination.limit = lmt;
        return pagination;
    }
}

module.exports = Controller;