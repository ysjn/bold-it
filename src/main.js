import sketch from 'sketch';

export default function() {
  const doc = sketch.getSelectedDocument();
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;

  if (selectedCount == 0) {
    sketch.UI.message('Please select a layer.');
  } else {
    const inputText = sketch.UI.getStringFromUser("Enter a text you want to bold", 'text');

    if (inputText.trim() == '') {
      sketch.UI.message('Please enter a text.');
      return false;
    }

    const selection = context.selection;

    for ( var i = 0; i < selectedCount; i++ ) {
      const layer = selection[i];
      const layerType = layer.class();

      if ( layerType == 'MSTextLayer' ) {
        const textValue = layer.stringValue();
        const textFont = NSFontManager.sharedFontManager().convertFont_toHaveTrait(layer.font(), 2);

        if (textFont.traits() != 2) {
          sketch.UI.message('Error: This font seems to have no bold weight 😢');
          return false;
        }

        var ranges = getRanges(textValue, inputText);

        if (ranges.length < 1) {
          sketch.UI.message('Error: No matching text found 😢');
          return false;
        }


        layer.setIsEditingText(true);
        for (let idx = 0; idx < ranges.length; idx++) {
          layer.addAttribute_value_forRange_(NSFontAttributeName, textFont, ranges[idx]);
        }
        layer.setIsEditingText(false);

      }
    }

    sketch.UI.message(`Bolded ${ranges.length} ${ranges.length > 1 ? 'texts' : 'text'}！ ✨`);

  }
}

function getRanges(str, query) {
  const len = query.length;
  const ranges = [];
  let idx = 0;
  let lastIdx = 0;

  while (str.indexOf(query, lastIdx) > -1) {
    idx = str.indexOf(query, lastIdx);
    ranges.push(NSMakeRange(idx, len));
    lastIdx = idx + len;
  }

  return ranges;
}
