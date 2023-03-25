export type IDContainer = {
  id: number;
  name: string;
}

const routeNames = ['home', 'forums', 'topics', 'threads']
const propNames = ['category_id', 'forum_id', 'topic_id', 'thread_id']

export function convertToCrumbs (parents: IDContainer[]) {
  const out = [{
    text: 'Home',
    to: {
      name: 'home'
    }
  }]
  parents.forEach((e, i) => {
    const to = { name: routeNames[i] }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (i) { to.params = { [propNames[i]]: e.id } } else { to.hash = `#C${e.id}` }

    out.push({
      text: e.name,
      to
    })
  })
  out.push()
  return out
}
