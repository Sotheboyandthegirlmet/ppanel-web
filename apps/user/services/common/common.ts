// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** Get verification code POST /v1/common/send_code */
export async function sendEmailCode(body: API.SendCodeRequest, options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.SendCodeResponse }>('/v1/common/send_code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** Get global config GET /v1/common/site/config */
export async function getGlobalConfig(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetGlobalConfigResponse }>('/v1/common/site/config', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get stat GET /v1/common/site/stat */
export async function getStat(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetStatResponse }>('/v1/common/site/stat', {
    method: 'GET',
    ...(options || {}),
  });
}

/** Get Subscription GET /v1/common/site/subscribe */
export async function getSubscription(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetSubscriptionResponse }>(
    '/v1/common/site/subscribe',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** Get Tos Content GET /v1/common/site/tos */
export async function getTos(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetTosResponse }>('/v1/common/site/tos', {
    method: 'GET',
    ...(options || {}),
  });
}
