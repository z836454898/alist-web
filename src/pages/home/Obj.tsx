import { useColorModeValue, VStack } from "@hope-ui/solid"
import { Suspense, Switch, Match, lazy, createEffect, on } from "solid-js"
import { FullLoading, Error } from "~/components"
import { resetGlobalPage, useObjTitle, usePath, useRouter } from "~/hooks"
import { objStore, recordScroll, /*layout,*/ State } from "~/store"

const Folder = lazy(() => import("./folder/Folder"))
const File = lazy(() => import("./file/File"))
const Password = lazy(() => import("./Password"))
// const ListSkeleton = lazy(() => import("./Folder/ListSkeleton"));
// const GridSkeleton = lazy(() => import("./Folder/GridSkeleton"));

let first = true
export const Obj = () => {
  const cardBg = useColorModeValue("white", "$neutral3")
  const { pathname } = useRouter()
  const { handlePathChange } = usePath()
  let lastPathname = pathname()
  createEffect(
    //目录跳转时触发
    on(pathname, (pathname) => {
      useObjTitle()
      //不是首次打开该页面
      if (!first) {
        resetGlobalPage()
      }
      first = false
      //记录滚动条位置
      recordScroll(lastPathname, window.scrollY)
      handlePathChange(pathname)
      lastPathname = pathname
    })
  )
  return (
    <VStack
      class="obj-box"
      w="$full"
      rounded="$xl"
      bgColor={cardBg()}
      p="$2"
      shadow="$lg"
      spacing="$2"
    >
      <Suspense fallback={<FullLoading />}>
        <Switch>
          {/*请求异常处理*/}
          <Match when={objStore.err}>
            <Error msg={objStore.err} disableColor />
          </Match>
          <Match
            when={[State.FetchingObj, State.FetchingObjs].includes(
              objStore.state
            )}
          >
            <FullLoading />
            {/* <Show when={layout() === "list"} fallback={<GridSkeleton />}>
              <ListSkeleton />
            </Show> */}
          </Match>
          <Match when={objStore.state === State.NeedPassword}>
            <Password />
          </Match>
          <Match
            when={[State.Folder, State.FetchingMore].includes(objStore.state)}
          >
            <Folder />
          </Match>
          <Match when={objStore.state === State.File}>
            <File />
          </Match>
        </Switch>
      </Suspense>
    </VStack>
  )
}
