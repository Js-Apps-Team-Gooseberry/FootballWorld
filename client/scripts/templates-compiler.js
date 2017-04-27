import Handlebars from 'handlebars';
import { get as getTemplate } from 'requester';
import paginate from 'handlebars-paginate';
import { formatDate } from 'utils';

Handlebars.registerHelper('date', date => {
    let formattedDate = formatDate(date);
    return formattedDate;
});

Handlebars.registerHelper('paginate', paginate);

const cachedTemplates = {};

function _get(name) {
    if (cachedTemplates[name]) {
        return Promise.resolve(cachedTemplates[name]);
    } else {
        let url = `/public/templates/${name}.handlebars`;

        return getTemplate(url)
            .then(template => {
                cachedTemplates[name] = template;
                return Promise.resolve(template);
            });
    }
}

function compile(templateName, data) {
    let result = _get(templateName)
        .then(template => {
            let templateFunction = Handlebars.compile(template);
            return templateFunction(data);
        });

    return result;
}


export { compile };