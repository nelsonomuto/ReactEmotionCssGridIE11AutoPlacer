# IE 11 Css grid auto prefix and cell autoplacement
<img width="1434" alt="screen shot 2019-02-04 at 1 05 24 am" src="https://user-images.githubusercontent.com/1546207/52192713-7690b800-2819-11e9-970c-1e6cfe6c6f9d.png">


Usage examples clone project (run `yarn install` then `yarn storybook` for interactive examples of the [AutoPlace.stories](./src/cssgrid/AutoPlace.stories.js)):
```
const stories = storiesOf('AutoPlace', module).add(
  'without css',
  () => (
    <AutoPlace>
      {new Array(5).fill('').map((i, index) => <div>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with css',
  () => (
    <AutoPlace
      css={css`
        grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr;
      `}
    >
      <div css={css`position: relative; color: green; border: 1px solid yellow; padding: 5px;`}>Self</div>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative; color: green; border: 1px solid red; padding: 5px;`}>{index}</div>)}
      {new Array(10).fill('').map((i, index) => <div css={css`position: relative; border: 1px solid pink; padding: 10px;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with css and nested fragments',
  () => (
    <AutoPlace
      css={css`
        grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr;
      `}
    >
      <React.Fragment>
        <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment</div>
      </React.Fragment>
      <div css={css`position: relative; color: white; background: black; border: 4px solid gold; padding: 5px;`}>By self</div>
      <React.Fragment>
        <React.Fragment>
          <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x2</div>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <React.Fragment>
            <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x3</div>
          </React.Fragment>
        </React.Fragment>
      </React.Fragment>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative; color: green; border: 1px solid red; padding: 5px;`}>{index}</div>)}
      {new Array(10).fill('').map((i, index) => <div css={css`position: relative; border: 1px solid pink; padding: 10px;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with css and nested fragments and unsetChildStyles',
  () => (
    <AutoPlace unsetChildStyles={true}
      css={css`
        grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr;
      `}
    >
      <React.Fragment>
        <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment</div>
      </React.Fragment>
      <div css={css`position: relative; color: white; background: black; border: 4px solid gold; padding: 5px;`}>By self</div>
      <React.Fragment>
        <React.Fragment>
          <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x2</div>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <React.Fragment>
            <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x3</div>
          </React.Fragment>
        </React.Fragment>
      </React.Fragment>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative; color: green; border: 1px solid red; padding: 5px;`}>{index}</div>)}
      {new Array(10).fill('').map((i, index) => <div css={css`position: relative; border: 1px solid pink; padding: 10px;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'all children under parent fragment with css and nested fragments and unsetChildStyles',
  () => (
    <AutoPlace unsetChildStyles={true}
      css={css`
        grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr;
      `}
    >
      <React.Fragment>
        <MediaQuery minWidth={1}>
          <React.Fragment>
            <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment</div>
          </React.Fragment>
        </MediaQuery>
        <div css={css`position: relative; color: white; background: black; border: 4px solid gold; padding: 5px;`}>By self</div>
        <React.Fragment>
          <React.Fragment>
            <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x2</div>
          </React.Fragment>
        </React.Fragment>
        <React.Fragment>
          <React.Fragment>
            <React.Fragment>
              <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x3</div>
            </React.Fragment>
          </React.Fragment>
        </React.Fragment>
        {new Array(5).fill('').map((i, index) => <div css={css`position: relative; color: green; border: 1px solid red; padding: 5px;`}>{index}</div>)}
        {new Array(10).fill('').map((i, index) => <div css={css`position: relative; border: 1px solid pink; padding: 10px;`}>{index}</div>)}
      </React.Fragment>
    </AutoPlace>
  )
);
stories.add(
  'with nested fragments and one self standing child',
  () => (
    <AutoPlace
      css={css`
        grid-template-columns: 1fr 2fr 1fr 3fr;
      `}
    >
      <div css={css`position: relative; color: white; background: black; border: 4px solid gold; padding: 5px;`}>By self</div>
      <React.Fragment>
        <React.Fragment>
          <div css={css`position: relative; color: blue; background: lightgrey; border: 1px solid yellow; padding: 5px;`}>In Fragment x2</div>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <div css={css`position: relative; color: red; border: 3px solid green; padding: 5px;`}>In Fragment x2</div>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x2</div>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <React.Fragment>
            <React.Fragment>
              <div css={css`position: relative; color: blue; border: 1px solid purple; padding: 5px;`}>In Fragment x3</div>
            </React.Fragment>
          </React.Fragment>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <React.Fragment>
            <div css={css`position: relative; color: brown; border: 1px solid gold; padding: 5px;`}>In Fragment x3</div>
          </React.Fragment>
        </React.Fragment>
      </React.Fragment>
      <React.Fragment>
        <React.Fragment>
          <React.Fragment>
            <div css={css`position: relative; color: white; background: darkblue; border: 1px solid pink; padding: 5px;`}>In Fragment x3</div>
          </React.Fragment>
        </React.Fragment>
      </React.Fragment>
    </AutoPlace>
  )
);
stories.add(
  'with explicit colLength',
  () => (
    <AutoPlace colLength={4}>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with nested children 18 colLength explicit',
  () => (
    <AutoPlace colLength={18}>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
      {[new Array(6).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {[new Array(7).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {new Array(8).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
      {[new Array(9).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {new Array(10).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with nested children and implicit colLength - length of children',
  () => (
    <AutoPlace>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
      {[new Array(6).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {[new Array(7).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {new Array(8).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
      {[new Array(9).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {new Array(10).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with nested children and colLength 1',
  () => (
    <AutoPlace colLength={1}>
      {new Array(5).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
      {[new Array(6).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {[new Array(7).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {new Array(8).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
      {[new Array(9).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)]}
      {new Array(10).fill('').map((i, index) => <div css={css`position: relative;`}>{index}</div>)}
    </AutoPlace>
  )
);
stories.add(
  'with fragment',
  () => (
    <AutoPlace colLength={18}>
      <React.Fragment>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </React.Fragment>
    </AutoPlace>
  )
);
stories.add(
  'with undefined, should ignore undefined items - there should be no gaps, 1 2 3 4 5',
  () => (
    <AutoPlace>
        <div>1</div>
        {new Array(10).fill()}
        <div>2</div>
        <div>3</div>
        {new Array(4).fill()}
        <div>4</div>
        <div>5</div>
    </AutoPlace>
  )
);
```
