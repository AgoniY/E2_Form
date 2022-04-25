import axios from '@/libs/api.request'

const prefixApi = 'http://program.yy.sti.gov'

export const updateTemplateContent = (keyId, tempContent) => {
    return axios.request({
        url: prefixApi + '/form/updateTemplateContent',
        method: 'post',
        withCredentials:true,       //设置跨域请求携带凭证（默认不会携带）
        cookieDomainRewrite:{
            '*':'http://192.168.2.40:8080'
        },
        cookiePathRewrite:{
            '*':'192.168.2.40'
        },
        headers:{
            Cookie: "__root_domain_v=.sti.gov; _qddaz=QD.773821821109238; ASP.NET_SessionId=gtmatps1bwfk4qbnvfkse2ml; ASP.NET_SessionId_NS_Sig=oenCV6mdznp9vwjm; ServiceProvider=69259060BC6F846EA6FFDF0AC68735F136C71AE3138389E57D977C474D1EF8CA1DC1DFDEDA5C326F647C3FF6D0C7AA2B9D1B68923524E1F3B6F908782ED6DCA58D82A2A5E2BA80A34F27892ECA589F50CA335BE3915A43B13C79C474CE63A66BB18BF5FF4AD9EBD5485A081B70AD6E4072486E850E1E2EDECDBDD95DAA6FD69468663AAFBD9DB55D18FCFDF48F27B17C7FD83E920C4CA831FF346152CC2B6A0D; _qddab=4-umvyj3.l0q0aj8c"
        },
        data: {
            keyId,
            tempContent,
        },
    })
}

export const fetchAddEquipment = (params) => {
    return axios.request({
        url: prefixApi + '/equipment/add',
        method: 'post',
        data: params,
    })
}

export const fetchEquipmentList = () => {
    return axios.request({
        url: prefixApi + '/equipment/info',
        method: 'get',
    })
}


export const fetchChangeCharacter = (params) => {
    return axios.request({
        url: prefixApi + '/character/change',
        method: 'post',
        data: params,
    })
}
