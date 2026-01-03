export class Controller {
    validate(req, rules) {
        // Basic validation stub - would integrate Zod or similar here
        console.log('Validating request...', rules);
    }
    json(res, data, status = 200) {
        return res.status(status).json(data);
    }
}
