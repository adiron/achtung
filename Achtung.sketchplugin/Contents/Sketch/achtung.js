var options = {
    multiple: 8 // Material for life
};

function roundToNearest(n) {
    var multiplier = n / options.multiple;
    if (multiplier < 1) {
        return options.multiple;
    } else {
        return (Math.round(multiplier) * options.multiple);
    }
}

// Actual runtime functions:
function roundWidth(context) {
    var sketch = context.api();
    sketch.selectedDocument.selectedLayers.iterate(function(element) {
        var f = element.frame;
        f.width = roundToNearest(f.width);
        log(f.width)
        element.frame = f;
    });
    context.document.showMessage("✅ 𝟖 Rounded width.");
}

function roundHeight(context) {
    var sketch = context.api();
    sketch.selectedDocument.selectedLayers.iterate(function(element) {
        var f = element.frame;
        f.height = roundToNearest(f.height);
        log(f.height)
        element.frame = f;
    });
    context.document.showMessage("✅ 𝟖 Rounded height.");
}

function roundVertical(context) {
    var sketch = context.api();

    var selection = [];
    sketch.selectedDocument.selectedLayers.iterate(function(element) {
        selection.push(element);
    });

    if (selection.length < 2) {
        context.document.showMessage("⛔ 𝟖 Not enough elements selected!");
        return;
    }

    selection = selection.sort((a,b) => a.frame.y - b.frame.y);

    var pairs = makePairs(selection);
    
    pairs.forEach((p) => {
        var first = p[0];
        var second = p[1];
        roundDistPairVert(second, first);
    })

    context.document.showMessage("✅ 𝟖 Rounded vertically.");
}

function roundHorizontal(context) {
    var sketch = context.api();

    var selection = [];
    sketch.selectedDocument.selectedLayers.iterate(function(element) {
        selection.push(element);
    });

    if (selection.length < 2) {
        context.document.showMessage("⛔ 𝟖 Not enough elements selected!");
        return;
    }

    selection = selection.sort((a,b) => a.frame.x - b.frame.x);

    var pairs = makePairs(selection);
    
    pairs.forEach((p) => {
        var first = p[0];
        var second = p[1];
        roundDistPairHoriz(second, first);
    })

    context.document.showMessage("✅ 𝟖 Rounded horizontally.");
}

function makePairs(selection) {
    // make pairs
    pairs = [];
    selection.forEach((elm, i) => {
        if (i !== selection.length - 1) {
            pairs.push([elm, selection[i + 1]]);
        }
    });
    return pairs;
}

// ---- HORIZ -----
function roundDistPairHoriz(second, first) {
    var offset;

    var dist = second.frame.x - (first.frame.x + first.frame.width);
    log(`Original distance: ${dist}`);

    // Are the rects intersecting?
    if (dist < 0) {
        // Yes
        var innerDist = second.frame.x - first.frame.x;
        var offset = innerDist - roundToNearest(innerDist);
    } else {
        // Nope
        var offset = dist - roundToNearest(dist);
    }

    var f = second.frame;
    log(`Ofsetting by: ${-offset}`);
    f.offset(-offset, 0);
    second.frame = f;
}

// |||| VERT ||||
function roundDistPairVert(second, first) {
    var offset;

    var dist = second.frame.y - (first.frame.y + first.frame.width);
    log(`Original distance: ${dist}`);

    // Are the rects intersecting?
    if (dist < 0) {
        // Yes
        var innerDist = second.frame.y - first.frame.y;
        var offset = innerDist - roundToNearest(innerDist);
    } else {
        // Nope
        var offset = dist - roundToNearest(dist);
    }

    var f = second.frame;
    log(`Ofsetting by: ${-offset}`);
    f.offset(0, -offset);
    second.frame = f;
}
