import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getCompanyById } from 'apiSdk/companies';
import { Error } from 'components/error';
import { CompanyInterface } from 'interfaces/company';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteFeatureById } from 'apiSdk/features';
import { deleteFeedbackById } from 'apiSdk/feedbacks';
import { deleteGoalById } from 'apiSdk/goals';

function CompanyViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<CompanyInterface>(
    () => (id ? `/companies/${id}` : null),
    () =>
      getCompanyById(id, {
        relations: ['user', 'feature', 'feedback', 'goal'],
      }),
  );

  const featureHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteFeatureById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const feedbackHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteFeedbackById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const goalHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteGoalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Company Detail View
          </Text>
          {hasAccess('company', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/companies/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Description:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Image:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.image}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('feature', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Features
                    </Text>
                    <NextLink passHref href={`/features/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>name</Th>
                          <Th>description</Th>
                          <Th>status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.feature?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/features/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.name}</Td>
                            <Td>{record.description}</Td>
                            <Td>{record.status}</Td>
                            <Td>
                              {hasAccess('feature', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/features/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('feature', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    featureHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('feedback', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Feedbacks
                    </Text>
                    <NextLink passHref href={`/feedbacks/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>content</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.feedback?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/feedbacks/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.content}</Td>
                            <Td>
                              {hasAccess('feedback', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/feedbacks/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('feedback', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    feedbackHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}

              {hasAccess('goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Goals
                    </Text>
                    <NextLink passHref href={`/goals/create?company_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>title</Th>
                          <Th>description</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.goal?.map((record) => (
                          <Tr cursor="pointer" onClick={() => router.push(`/goals/view/${record.id}`)} key={record.id}>
                            <Td>{record.title}</Td>
                            <Td>{record.description}</Td>
                            <Td>
                              {hasAccess('goal', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/goals/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('goal', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    goalHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box></Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'company',
  operation: AccessOperationEnum.READ,
})(CompanyViewPage);
