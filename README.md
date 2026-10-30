# Wordplay

Play online at [https://AndreasArvidsson.github.io/wordplay](https://AndreasArvidsson.github.io/wordplay)

## Scoring

Each solved word has a base score equal to its letter count squared: 3 letters
are worth 9 points, 4 letters are worth 16, and 6 letters are worth 36.

Each clue revealed for a word reduces its base score by 15%, down to a minimum
of 25% of the base score. The result is rounded to the nearest whole point.
For example, a six-letter word earns 36 points without clues, 31 points with
one clue, and 9 points with five clues.

Each word scores only once. Words revealed by giving up do not earn points.
The maximum score shown is the total possible score without using clues.

## Vocabulary source

[Linguabase](https://huggingface.co/datasets/linguabase/linguabase)

- [vocabulary.core.tsv.gz](https://huggingface.co/datasets/linguabase/linguabase/blob/main/vocabulary/vocabulary.core.tsv.gz)
- [definitions.core.tsv.gz](https://huggingface.co/datasets/linguabase/linguabase/blob/main/definitions/definitions.core.tsv.gz)
- [clues.core.tsv.gz](https://huggingface.co/datasets/linguabase/linguabase/blob/main/clues/clues.core.tsv.gz)
- [scores_labels.core.tsv.gz](https://huggingface.co/datasets/linguabase/linguabase/blob/main/scores_labels/scores_labels.core.tsv.gz)

## Todo

- Rounds
- Local storage of settings and scores
- timed
