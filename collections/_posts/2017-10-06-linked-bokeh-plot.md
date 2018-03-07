---
layout: post
title: "Creating linked plots using Python's bokeh library"
author: "Michael J. Moon"
categories: post
tags: [bokeh, python, data visualization, pandas]
---
In this post, I am going to create interlinked, interactive scatter plots using the [**Bokeh**](https://bokeh.pydata.org/en/latest/ 'Bokeh homepage'){:target="_blank"} library. Below is the description of the library from the homepage.

> Bokeh is a Python interactive visualization library that targets modern web browsers for presentation. Its goal is to provide elegant, concise construction of novel graphics in the style of D3.js, and to extend this capability with high-performance interactivity over very large or streaming datasets. Bokeh can help anyone who would like to quickly and easily create interactive plots, dashboards, and data applications.

I quite like its clean look and more than anything the interactive visualization capabilities. It also allows using javascript based web browser interactions without learning javascript. I have been picking on what it can do from its documentations and tutorials available on [Bokeh NBViewer Gallery](http://nbviewer.jupyter.org/github/bokeh/bokeh-notebooks/blob/master/index.ipynb){:target="_blank"}.

## Load libraries
First, I am going to load the libraries I am going to use and run `output_notebook` function from the `bokeh` library. The function configures Bokeh plot objects to be displayed on the notebook.


```python
import pandas as pd
from bokeh.io import output_notebook, output_file, show
from bokeh.plotting import figure
from bokeh.models import ColumnDataSource
from bokeh.models import CategoricalColorMapper
from bokeh.models import Plot, Range1d, HoverTool
from bokeh.layouts import gridplot
from bokeh.palettes import Set2
output_notebook()
```

## Load data
To enable interlinking between plots, a common `ColumnDataSource` needs to be used as the data source between plots. You can create one from a pandas `DataFrame` or a `dictionary`. I am going to use the **diabetes** dataset originally from [here](http://www4.stat.ncsu.edu/~boos/var.select/diabetes.html){:target="_blank"} to demonstrate this. Below is a brief description of the dataset from the original source.

>Ten baseline variables, age, sex, body mass index, average blood pressure, and six blood serum measurements were obtained for each of n = 442 diabetes patients, as well as the response of interest, a quantitative measure of disease progression one year after baseline.

I am going to plot each of the 9 numeric features against the response variable on individual scatter plots. I will
In the code block below, the dataset is loaded as a pandas `DataFrame` and a `ColumnDataSource` is defined using the `DataFrame`.


```python
df = pd.read_table('../data/diabetes_tab.txt')
# assuming 1 is female and 2 is male
df['Gender'] = ['FEMALE' if x == 1 else 'MALE'
                for x in df.SEX.values]
df.rename(columns={'AGE': 'Age'}, inplace=True)
one_source = ColumnDataSource(df)
df.head()
```


<div class="tablecontainer">
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Age</th>
      <th>SEX</th>
      <th>BMI</th>
      <th>BP</th>
      <th>S1</th>
      <th>S2</th>
      <th>S3</th>
      <th>S4</th>
      <th>S5</th>
      <th>S6</th>
      <th>Y</th>
      <th>Gender</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>59</td>
      <td>2</td>
      <td>32.1</td>
      <td>101.0</td>
      <td>157</td>
      <td>93.2</td>
      <td>38.0</td>
      <td>4.0</td>
      <td>4.8598</td>
      <td>87</td>
      <td>151</td>
      <td>MALE</td>
    </tr>
    <tr>
      <th>1</th>
      <td>48</td>
      <td>1</td>
      <td>21.6</td>
      <td>87.0</td>
      <td>183</td>
      <td>103.2</td>
      <td>70.0</td>
      <td>3.0</td>
      <td>3.8918</td>
      <td>69</td>
      <td>75</td>
      <td>FEMALE</td>
    </tr>
    <tr>
      <th>2</th>
      <td>72</td>
      <td>2</td>
      <td>30.5</td>
      <td>93.0</td>
      <td>156</td>
      <td>93.6</td>
      <td>41.0</td>
      <td>4.0</td>
      <td>4.6728</td>
      <td>85</td>
      <td>141</td>
      <td>MALE</td>
    </tr>
    <tr>
      <th>3</th>
      <td>24</td>
      <td>1</td>
      <td>25.3</td>
      <td>84.0</td>
      <td>198</td>
      <td>131.4</td>
      <td>40.0</td>
      <td>5.0</td>
      <td>4.8903</td>
      <td>89</td>
      <td>206</td>
      <td>FEMALE</td>
    </tr>
    <tr>
      <th>4</th>
      <td>50</td>
      <td>1</td>
      <td>23.0</td>
      <td>101.0</td>
      <td>192</td>
      <td>125.4</td>
      <td>52.0</td>
      <td>4.0</td>
      <td>4.2905</td>
      <td>80</td>
      <td>135</td>
      <td>FEMALE</td>
    </tr>
  </tbody>
</table>
</div>



## Create an interactive scatter plot
Next, I am going to create a single scatter plot with age and the response variable. I am going to add a few interaction effects including a hover effect showing the x, y values of each point.
+ Box select: Highlight data points selected in a rectangular box by dragging the mouse
+ Lasso select: Highlight data points selected in a lasso shape by dragging the mouse
+ Tap: Highlight selected data points by clicking the mouse
+ Wheel zoom: Zoom in and out of the plot using the mouse wheel zoom
+ Reset: Reset the plot to its default state


```python
# define a color map for SEX variable
cmap = CategoricalColorMapper(
    factors=('FEMALE', 'MALE'),
    palette=Set2[3]
)
# define a function to enable reuse
def plot_diabetes(x, width=480, height=320,
                  legend=None, legend_location=None,
                  legend_orientation='vertical'):
    hover = HoverTool(
        tooltips=[('Index', '$index'),
                  (x, '$x'),
                  ('Progression', '$y'),
                  ('Gender', '@Gender')
                 ])
    tools = [hover, 'box_select', 'tap',
             'wheel_zoom', 'reset', 'help']
    plt = figure(width=width, height=height,
                 title=x +' vs. diabetes progression',
                 tools=tools)
    plt.circle(x, 'Y', alpha=0.8, source=one_source,
               fill_color={'field': 'Gender', 'transform': cmap},
               line_color={'field': 'Gender', 'transform': cmap},
               # highlight when selected
               selection_alpha=1,
               selection_fill_color={'field': 'Gender', 'transform': cmap},
               selection_line_color={'field': 'Gender', 'transform': cmap},
               # mute when not selected
               nonselection_alpha=0.2,
               nonselection_fill_color={'field': 'Gender', 'transform': cmap},
               nonselection_line_color=None,
               legend=legend)
    plt.xaxis.axis_label = x
    plt.xaxis.axis_label_text_font_style = 'normal'
    plt.yaxis.axis_label = 'Diabetes progression'
    plt.yaxis.axis_label_text_font_style = 'normal'
    if(legend):
        plt.legend.location = legend_location
        plt.legend.orientation = legend_orientation
        plt.legend.background_fill_alpha = 0.7
    return(plt)

p1 = plot_diabetes('Age', legend='Gender', legend_location='top_left',
                   legend_orientation='horizontal')
output_file('../html/01-bokeh-plot-example-plot-01.html')
show(p1)

```

{% include plots/2017-10-06-plot-01.html %}


You can now see an interactive scatter plot. A toolbar is placed beside the plot where you can switch on and off different tools we included. In particular, in this plot you can see the values for each data point when you hover over them. You can set the list of values you want to show by configuring `tooltips` with a list of *(label, value)* pairs in the `HoverTool` object.

You can refer to different variables in the source dataset by prefixing `@`. Fields starting with `$` will are used for *"special fields"* such as the coordinates <s>and the color</s> <sup><sub>[apparently](https://stackoverflow.com/questions/41708509/bokeh-color-not-appearing-on-hover-tooltip){:target="_blank"} the color values are pulled from the data source, not the figure's `fill_color`</sub></sup> as used above.



## Create multiple linked plots
Now, I am going to create multiple plots and place them in a single grid using bokeh library's `gridplot`. The plots are linked by a single data source. Selecting data points in one plot will highlight the same data points in all.


```python
plots = [plot_diabetes(x, 240, 180)
         for x in df.columns
         if x not in ['SEX', 'Gender', 'Y']]

# create an empty plot with only the title
gtitle = figure(width=240, height=80, title='Linked scatter plots')
gtitle.circle(0, 0, fill_color=None, line_color=None)
gtitle.title.text_font_size = '18px'
gtitle.border_fill_color = None
gtitle.grid.visible = False
gtitle.axis.visible = False
gtitle.outline_line_color = None

# create an empty plot with only the legend
glegend = figure(width=240, height=80, title=None)
glegend.circle(0,0, fill_color=Set2[3][0], line_color=Set2[3][0], legend='FEMALE')
glegend.circle(0,0, fill_color=Set2[3][1], line_color=Set2[3][1], legend='MALE')
glegend.border_fill_color = None
glegend.grid.visible = False
glegend.axis.visible = False
glegend.outline_line_color = None
glegend.legend.border_line_color = None
glegend.legend.location = 'center'

output_file('../html/01-bokeh-plot-example-plot-02.html')
show(gridplot([gtitle, None, glegend] + plots, ncols=3))
```

{% include plots/2017-10-06-plot-02.html %}


You can now see nine different plots linked with a single data source. When you select any data points in one plot the same data points are highlighted across all while the rest are 'muted'.

This could be useful when inspecting data with multiple dimensions. For example, when I clicked on the person with the highest S1 measurement, I can she that he also had the highest measurements of S2 and S4. Besides, it is just **fun** playing with these plots. I am looking forward to going through more of the library examples and tutorials.
