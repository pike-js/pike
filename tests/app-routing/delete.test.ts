import { Delete, pike, PikeRequest } from '@pikejs/server';
import { bootstrapTestHarness } from '@pikejs/test';


describe('Delete decorator', () => {
  const testRoute = (route: any) => bootstrapTestHarness(() => pike({ controllers: [route] }))();

  it('should support dynamic segments', async () => {
    class Controller {
      @Delete(':id')
      async get(request: PikeRequest) {
        return { hello: request.params.id };
      }
    }
    const app = await testRoute(Controller);

    const response = await app.request({ url: '/foo', method: 'DELETE' });
    expect(response.body).toEqual({hello: 'foo'});
  });
});
