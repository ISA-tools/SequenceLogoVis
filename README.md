<div align="center">
<img src="http://isatools.files.wordpress.com/2014/05/sequence-logo.png" width="200px"/>
<br/>
</div>


Last Updated 14 May 2014

## Using the Sequence Logo



To use the sequence logo, include the 'assets' found in the repository in your code base. This means a link to css/popup.css, js/lib/*, and SequenceLogo.js. Then, to run, include this JavaScript to generate the sequence logo with 1 or more files. 
 

```
	SequenceLogo.rendering.createSequenceLogo(
            {
                files: ["data/panel-a.txt", "data/panel-b.txt"],
                placement: "visualization",
                width: 1000,
                height: 500,
                glyph_strategy: "only_differences",
                height_algorithm: "frequency",
                type:"amino_acids",
                highlight_conserved: false,
                draw_consensus: true
            }
    );
```
	

## Protein Support
<div align="center">
<img src="http://isatools.files.wordpress.com/2014/05/screen-shot-2014-05-14-at-11-47-05.png" width="600px"/>
</div>

### Display by frequency rather than entropy

This example also shows the detail on demand view to give the actual number of samples found with a particular residue at that position.

<div align="center">
<img src="http://isatools.files.wordpress.com/2014/05/screen-shot-2014-05-14-at-11-49-17.png" width="600px"/>
</div>



## DNA Support

<div align="center">
<img src="http://isatools.files.wordpress.com/2014/05/screen-shot-2014-05-14-at-11-43-15.png" width="600px"/>
</div>

## Configurability

### Highlight Conserved Regions

```
	SequenceLogo.rendering.createSequenceLogo(
            {
                files: ["data/panel-a.txt", "data/panel-b.txt"],
                placement: "visualization",
                width: 1000,
                height: 500,
                glyph_strategy: "only_differences",
                height_algorithm: "entropy",
                type:"amino_acids",
                highlight_conserved: true,
                draw_consensus: false
            }
    );
```

<div align="center">
<img src="http://isatools.files.wordpress.com/2014/05/screen-shot-2014-05-14-at-11-46-52.png" width="600px"/>
</div>

### Show Consensus Sequence

```
	SequenceLogo.rendering.createSequenceLogo(
            {
                files: ["data/panel-a.txt", "data/panel-b.txt"],
                placement: "visualization",
                width: 1000,
                height: 500,
                glyph_strategy: "only_differences",
                height_algorithm: "entropy",
                type:"amino_acids",
                highlight_conserved: false,
                draw_consensus: true
            }
    );
```
<div align="center">
<img src="http://isatools.files.wordpress.com/2014/05/screen-shot-2014-05-14-at-11-48-11.png" width="600px"/>
</div>

### Show Glyphs Only when Differences Occur
```
	SequenceLogo.rendering.createSequenceLogo(
            {
                files: ["data/panel-a.txt", "data/panel-b.txt"],
                placement: "visualization",
                width: 1000,
                height: 500,
                glyph_strategy: "only_differences", or "all"
                height_algorithm: "entropy",
                type:"amino_acids",
                highlight_conserved: false,
                draw_consensus: true
            }
    );
```

### Cite this work
[E. Maguire, P. Rocca-Serra, S.-A. Sansone, and M. Chen, Redesigning the sequence logo with glyph-based approaches to aid interpretation, In Proceedings of EuroVis 2014, Short Paper (2014)](https://isa-tools.org/wp-content/uploads/2014/07/sequencelogoredesign.pdf)
