import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {JSDOM} from 'jsdom'
import {expect,it} from 'vitest'
import Properties from '../src/components/editor/Properties'
it('uploaded or imported logo cannot introduce an active HTML event handler',()=>{
 const payload='<svg xmlns="http://www.w3.org/2000/svg"><image onerror="window.auditMarker=1" href="invalid"/></svg>'
 const markup=renderToStaticMarkup(<Properties selectedElement={{id:'test',type:'3d_logo',svgData:payload,width:100,height:100}} onUpdate={()=>{}} onDelete={()=>{}} />)
 const dom=new JSDOM(markup,{runScripts:'dangerously',url:'https://www.kreatekaro.co/'})
 dom.window.document.querySelector('image[onerror]')?.dispatchEvent(new dom.window.Event('error'))
 expect((dom.window as any).auditMarker).toBeUndefined()
 expect(dom.window.document.querySelector('[onerror]')).toBeNull()
 dom.window.close()
})
