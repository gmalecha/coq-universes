function parse(str) {
    var RELS = ["<=","<","=",">",">="];

    var strs = str.split(/\s+/);
    var result = {};

    function flip(r) {
	return RELS[2 - (RELS.indexOf(r) - 2)];
    }

    function add(f,r,t) {
	if (typeof(result[f]) == 'undefined') { result[f] = {}; }
	if (typeof(result[t]) == 'undefined') { result[t] = {}; }

	result[f][t] = r;
	result[t][f] = flip(r);
    }

    var i = 0;

    while (i < strs.length) {
	var at = strs[i];
	var id = RELS.indexOf(strs[++i]);
	while (id != -1) {
	    add(at, strs[i], strs[i+1]);
	    at = strs[i+1];
	    i+=2;
	    id = RELS.indexOf(strs[i]);
	}
    }
    return result;
}



function process(gr) {
    var data = {};
    var index = 0;
    var S = [];
    var contents = {};
    var SCCs = []
    function strong_connect(v)
    {
	data[v] = {};
	data[v].index = index;
	data[v].lowlink = index;
	index = index + 1;
	S.push(v);
	contents[v] = 0;

	for (var w in gr[v]) {
	    if (typeof(data[w]) == 'undefined') {
		strong_connect(w);
		data[v].lowlink = Math.min(data[v].lowlink, data[w].lowlink);
	    } else if (typeof(contents[w]) != 'undefined') {
		data[v].lowlink = Math.min(data[v].lowlink, data[w].index)
	    }
	}

	if (data[v].lowlink == data[v].index) {
	    var SCC = [];
	    do {
		w = S.pop();
		delete contents[w];
		SCC.push(w)
	    } while (w != v) ;
	    SCCs.push(SCC);
	}
    }

    for (var v in gr) {
	if (typeof(data[v]) == 'undefined') {
	    strong_connect(v);
	}
    }

    return SCCs;
}
