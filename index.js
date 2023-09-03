function lexical_evaluation(statement)
{
    let allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()∼∼~^∧v→→↔↔ ";
    statement.split('').forEach(
        (c) => {
            if (!allowed.includes(c)) {
                throw c + " é um caractere inválido.";
            }
        }
    )
}

function sintatic_evaluation(statement)
{
    let stack = [];
    let separators = {
        "open": ["(", "[", "{"],
        "close": [")", "]", "}"],
    };
    let units = statement.split('');
    units = units.filter(
        (c) => {
            return c != " ";
        }
    )

    let only_separators = units.filter(
            (c) => {return "([{}])".includes(c)}
        );
    let num_open_separators = {
        "(": 0,
        "[": 0,
        "{": 0,
    };
    let num_close_separators = {
        ")": 0,
        "]": 0,
        "}": 0,
    }

    // CHECK IF SEPARATORS ARE BALANCED
    for (let i = 0; i < only_separators.length; i++) {
        if (separators["open"].includes(only_separators[i])) {
            stack.push(only_separators[i]);
            num_open_separators[only_separators[i]]++;
        }
        else if (separators["close"].includes(only_separators[i])) {
            num_close_separators[only_separators[i]]++;
            let pos = separators["close"].indexOf(only_separators[i]);
            if ((stack.length > 0) && (separators["open"][pos] === stack[stack.length - 1])) {
                stack.pop();
            }
            else {
                throw "Sintaxe inválida. Desbalanço nos parênteses, colchetes ou chaves.";
            }
        }
    }

    if (num_open_separators["("] != num_close_separators[")"] || num_open_separators["["] != num_close_separators["]"] || num_open_separators["{"] != num_close_separators["}"]) {
        throw "Sintaxe inválida. Desbalanço nos parênteses, colchetes ou chaves.";
    }

    let operators = "∼∼~^∧v→→↔↔";
    let only_operators = [];
    for (let i = 0; i < units.length; i++) {
        if (operators.includes(units[i])) {
            only_operators.push([units[i], i]);
        }
    }

    // CHECK FOR OPERATOR CONFLICTS
    for (let i = 0; i < only_operators.length - 1; i++) {
        if (!"∼∼~".includes(only_operators[i][0]) && !"∼∼~".includes(only_operators[i+1][0])) {
            if (only_operators[i][1] === (only_operators[i+1][1] - 1)) {
                throw "Sintaxe inválida. Conflito de operadores: " + only_operators[i][0] + only_operators[i + 1][0];
            }
        }
        else {
            if ("^∧v→→↔↔".includes(only_operators[i + 1][0]) && only_operators[i][1] === (only_operators[i + 1][1] - 1)) {
                throw "Sintaxe inválida. Conflito de operadores: " + only_operators[i][0] + only_operators[i + 1][0];
            }
        }
    }
    if (operators.includes(units[units.length - 1])) {
        throw "Sintaxe inválida. Operador solitário."
    }
    let identificators = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 1; i < units.length - 1; i++) {
        if (identificators.includes(units[i-1]) && "∼∼~".includes(units[i]) && identificators.includes(units[i+1])) {
            throw "Sintaxe inválida. Negação indevida.";
        }
    }

    // CHECK FOR CONFLICTS BETWEEN OPERATORS AND SEPARATORS
    let ops_and_seps = [];
    for (let i = 0; i < units.length; i++) {
        if (operators.includes(units[i])) {
            ops_and_seps.push([units[i], i]);
        }
        else if (separators["open"].includes(units[i]) || separators["close"].includes(units[i])) {
            ops_and_seps.push([units[i], i]);
        }
    }

    for (let i = 0; i < ops_and_seps.length - 1; i++) {
        if (ops_and_seps[i][1] === ops_and_seps[i+1][1] - 1) {
            if (separators["open"].includes(ops_and_seps[i][0]) && !"∼∼~".includes(ops_and_seps[i + 1][0])) {
                throw "Sintaxe inválida. Operador mal posicionado.";
            }
            else if (operators.includes(ops_and_seps[i][0]) && separators["close"].includes(ops_and_seps[i + 1][0])) {
                throw "Sintaxe inválida. Operador mal posicionado.";
            }
        }
    }

    // CHECK FOR IDENTIFICATORS FOLLOWED BY OPEN SEPARATORS
    for (let i = 0; i < units.length - 1; i++) {
        if (identificators.includes(units[i]) && separators["open"].includes(units[i+1])) {
            throw "Sintaxe inválida. Identificador seguido de abertura de parênteses/colchetes/chaves.";
        }
    }

    // CHECK FOR IDENTIFICATORS FOLLOWED BY IDENTIFICATORS
    for (let i = 0; i < units.length - 1; i++) {
        if (identificators.includes(units[i]) && identificators.includes(units[i+1])) {
            throw "Sintaxe inválida. Identificador seguido de identificador.";
        }
    }
}

function shunting_yard(expression)
{
    let is_variable = (c) => { return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c) };
    let is_operator = (c) => { return "∼∼~^∧v→→↔↔".includes(c) };
    let operator_precedence = {
        "∼": 0,
        "∼": 0,
        "~": 0,
        "^": 1,
        "∧": 1,
        "v": 2,
        "→": 3,
        "→": 3,
        "↔": 4,
        "↔": 4,
    };

    let output = [];
    let operator_stack = [];

    for (i of expression) {
        if (is_variable(i)) {
            output.push(i);
        }
        else if (is_operator(i)) {
            let j = operator_stack.length - 1;
            let curr_operator = i;
            while (operator_stack.length > 0 && operator_precedence[curr_operator] > operator_precedence[operator_stack[j]]) {
                output.push(operator_stack.pop());
                j--;
            }
            operator_stack.push(curr_operator);
        }
        else if (i === "(") {
            operator_stack.push(i);
        }
        else if (i === ")") {
            let j = operator_stack.length;
            while (operator_stack[j-1] !== "(") {
                output.push(operator_stack.pop());
                j--;
            }
            operator_stack.pop()
        }
        // console.log(i);
        // console.log(output);
        // console.log(operator_stack);
    }

    // console.log(output);
    // console.log(operator_stack);
    while (operator_stack.length) {
        output.push(operator_stack.pop());
    }

    return output;
}

function conjunction(p, q) {
    return p && q;
}

function disjunction(p, q) {
    return p || q;
}

function conditional(p, q) {
    return !p || q
}

function biconditional(p, q) {
    return ((!p || q) && (!q || p));
}

function negation(p) {
    return !p;
}

let operations = {
    "∼": negation,
    "∼": negation,
    "~": negation,
    "^": conjunction,
    "∧": conjunction,
    "v": disjunction,
    "→": conditional,
    "→": conditional,
    "↔": biconditional,
    "↔": biconditional,
};

function evaluate(expression, values)
{
    let is_variable = (c) => { return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c) };
    let is_negation = (c) => { return "∼∼~".includes(c) };

    let stack = [];

    // console.log(expression);
    // console.log(values);
    let iter = 0;

    for (i of expression) {
        // console.log(iter++);
        // console.log(stack);
        if (is_variable(i)) {
            // console.log("is var");
            stack.push(values[i]);
            continue;
        }
        else if (!is_negation(i)){
            // console.log("is op: ", i);
            let b = stack.pop();
            let a = stack.pop();
            // console.log(a, b);
            stack.push(operations[i](a, b));
            continue;
        }
        else {
            let a = stack.pop();
            stack.push(operations[i](a));
        }
    }
    // console.log(stack);
    // console.log(stack[stack.length-1]);
    return stack[stack.length-1];
}

function deduction_tree(statement)
{
    let units = statement.split('');
    let identificators = units.filter((c) => {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c);
    });
    // console.log(identificators);

    let variables = {};
    for (i of identificators) {
        variables[i] = true;
    }
    let num_variables = Object.keys(variables).length;
    let rows = Math.pow(2, num_variables);

    let truth_table = [];

    let to_binary = (n, d) => {
        let binary = n.toString(2);
        binary = binary.length != d ? "0".repeat(d - binary.length) + binary : binary;
        return binary;
    }

    truth_table.push([]);
    truth_table[0] = Object.keys(variables);
    for (let i = 1; i < rows+1; i++) {
        truth_table.push([]);
        let binary = to_binary(i-1, num_variables);
        for (let j = 0; j < num_variables; j++) {
            let to_bool = binary.substr(j, 1) === '1';
            truth_table[i].push(to_bool);
        }
    }
    formatted_stmt = statement.split(' ').reduce((acc, c) => {return acc + c});
    truth_table[0].push(formatted_stmt);
    // console.log(truth_table);
    // console.log(formatted_stmt);

    const result = document.querySelector("#result");
    const table = document.createElement('table');
    table.id = "result_table";
    for (let i = 0; i < rows+1; i++) {
        const tr = table.insertRow();
        for (j of truth_table[i]) {
            const td = tr.insertCell();
            let text;
            if (i === 0) {
                text = j; 
            }
            else {
                text = j ? "V" : "F";
            }
            td.id = `table_{$i}-{$j}`;
            td.appendChild(document.createTextNode(`${text}`));
        }
    }

    if (result.childElementCount !== 0) {
        result.removeChild(result.children[0]);
    }
    result.appendChild(table);

    let table_rows = Array.prototype.slice.call(document.querySelector("#result_table").children[0].children);
    // console.log(table_rows);
    let result_rows = [];
    for (i of table_rows.slice(1)) {
        // console.log(i.innerText);
        let var_values = i.innerText.split("\t");
        // console.log(var_values);
        let values = {};
        for (let j = 0; j < num_variables; j++) {
            values[identificators[j]] = var_values[j] === "V";
        }
        // console.log(values);
        let rpn = shunting_yard(formatted_stmt);
        result_rows.push(evaluate(rpn, values));
    }
    console.log(result_rows);

    for (let i = 0; i < result_rows.length; i++) {
        let row = table.rows[i + 1];
        row.insertCell();
        row.cells[row.cells.length-1].innerText = result_rows[i] ? "V" : "F";
    }

    return result_rows.reduce((c, x) => {return c && x});
}

function handle_input()
{
    try {
        document.querySelector("#status").innerText = "";
        let input = document.querySelector("#formula_input").value;
        lexical_evaluation(input);
        document.querySelector("#status").innerText += "✅ Análise léxica\n"
        sintatic_evaluation(input);
        document.querySelector("#status").innerText += "✅ Análise sintática\n"
        let result = deduction_tree(input);
        console.log(result);
    }
    catch (err) {
        document.querySelector("#status").innerText += "❌ " + err;
    }
}

function keyboard_type(char)
{
    document.querySelector("#formula_input").value += char;
}