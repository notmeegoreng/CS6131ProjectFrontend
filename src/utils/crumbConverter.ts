export type IDContainer = {
  id: number;
  name: string;
}

const routeNames = ['home', 'forums', 'topics', 'threads']

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
    if (i) { to.params = { id: e.id } } else { to.hash = `#C${e.id}` }

    out.push({
      text: e.name,
      to
    })
  })
  out.push()
  return out
}
