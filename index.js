function lexical_evaluation(statement)
{
    let allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()[]{}∼∼~^∧v→→↔↔ ";
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
}

function deduction_tree(statement)
{
    let units = statement.split('');
    let ids = units.filter((c) => {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(c);
    });

    let variables = {};
    for (i of ids) {
        variables[i] = true;
    }

    console.log(variables);

    function conjunction() {

    }

    function disjunction() {

    }

    function conditional() {

    }

    function biconditional() {

    }

    if (statement.length === 1) {
        return true;
    }
    else {
        return false;
    }
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
        document.querySelector("#result").innerText = result;
    }
    catch (err) {
        document.querySelector("#status").innerText += "❌ " + err;
    }
}

function keyboard_type(char)
{
    document.querySelector("#formula_input").value += char;
}